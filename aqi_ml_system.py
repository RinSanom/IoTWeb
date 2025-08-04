#!/usr/bin/env python3
"""
AQI Machine Learning System
Complete Air Quality Index prediction system using multiple air quality parameters
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import warnings
warnings.filterwarnings('ignore')

class AQIMLSystem:
    def __init__(self, csv_file):
        """
        Initialize the AQI Machine Learning System
        
        Args:
            csv_file (str): Path to the CSV file containing air quality data
        """
        self.csv_file = csv_file
        self.df = None
        self.processed_df = None
        self.models = {}
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.target_column = 'aqi'
        
    def load_and_explore_data(self):
        """Load and explore the dataset"""
        print("🔍 Loading and exploring data...")
        
        # Load data
        self.df = pd.read_csv(self.csv_file)
        print(f"📊 Dataset shape: {self.df.shape}")
        print("\n📋 Dataset info:")
        print(self.df.info())
        
        print("\n📈 Parameter distribution:")
        print(self.df['parameter'].value_counts())
        
        print("\n🔢 Sample data:")
        print(self.df.head())
        
        return self.df
    
    def calculate_aqi(self, pm1, pm25, temperature, humidity):
        """
        Calculate AQI based on PM1, PM2.5, temperature, and humidity
        Using a simplified AQI calculation based on PM2.5 as primary indicator
        
        Args:
            pm1: PM1 concentration (µg/m³)
            pm25: PM2.5 concentration (µg/m³)
            temperature: Temperature (°C)
            humidity: Relative humidity (%)
        Returns:
            AQI value (0-500 scale)
        """
        # Primary AQI calculation based on PM2.5
        if pm25 <= 12.0:
            aqi_pm25 = ((50 - 0) / (12.0 - 0.0)) * (pm25 - 0.0) + 0
        elif pm25 <= 35.4:
            aqi_pm25 = ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51
        elif pm25 <= 55.4:
            aqi_pm25 = ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101
        elif pm25 <= 150.4:
            aqi_pm25 = ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151
        elif pm25 <= 250.4:
            aqi_pm25 = ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201
        else:
            aqi_pm25 = ((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301
        
        # Adjust AQI based on PM1 (smaller particles, more health impact)
        pm1_factor = min(pm1 / pm25, 2.0) if pm25 > 0 else 1.0
        aqi_adjusted = aqi_pm25 * (1 + (pm1_factor - 1) * 0.3)
        
        # Temperature and humidity adjustments
        temp_factor = 1.0
        if temperature > 30:  # Hot weather can worsen air quality effects
            temp_factor = 1.1
        elif temperature < 0:  # Cold weather can trap pollutants
            temp_factor = 1.05
            
        humidity_factor = 1.0
        if humidity > 80:  # High humidity can worsen air quality
            humidity_factor = 1.05
        elif humidity < 30:  # Low humidity can increase particulate matter
            humidity_factor = 1.03
        
        final_aqi = aqi_adjusted * temp_factor * humidity_factor
        
        # Cap AQI at 500
        return min(final_aqi, 500)
    
    def get_aqi_category(self, aqi):
        """Get AQI category and color code"""
        if aqi <= 50:
            return "Good", "#00E400"
        elif aqi <= 100:
            return "Moderate", "#FFFF00"
        elif aqi <= 150:
            return "Unhealthy for Sensitive Groups", "#FF7E00"
        elif aqi <= 200:
            return "Unhealthy", "#FF0000"
        elif aqi <= 300:
            return "Very Unhealthy", "#8F3F97"
        else:
            return "Hazardous", "#7E0023"
    
    def preprocess_data(self):
        """Preprocess the data for machine learning"""
        print("🔧 Preprocessing data...")
        
        # Convert datetime columns
        self.df['datetimeUtc'] = pd.to_datetime(self.df['datetimeUtc'])
        self.df['datetimeLocal'] = pd.to_datetime(self.df['datetimeLocal'])
        
        # Pivot the data to have parameters as columns
        pivot_df = self.df.pivot_table(
            index=['location_id', 'datetimeUtc', 'datetimeLocal', 'latitude', 'longitude'],
            columns='parameter',
            values='value',
            aggfunc='mean'
        ).reset_index()
        
        # Flatten column names
        pivot_df.columns.name = None
        
        # Clean column names
        column_mapping = {
            'pm1': 'pm1',
            'pm25': 'pm25', 
            'relativehumidity': 'humidity',
            'temperature': 'temperature',
            'um003': 'ultrafine_particles'
        }
        
        for old_col, new_col in column_mapping.items():
            if old_col in pivot_df.columns:
                pivot_df[new_col] = pivot_df[old_col]
        
        # Keep only the renamed columns and metadata
        metadata_cols = ['location_id', 'datetimeUtc', 'datetimeLocal', 'latitude', 'longitude']
        feature_cols = list(column_mapping.values())
        
        # Select available columns
        available_cols = metadata_cols + [col for col in feature_cols if col in pivot_df.columns]
        self.processed_df = pivot_df[available_cols].copy()
        
        # Remove rows with missing critical values
        critical_cols = ['pm1', 'pm25', 'temperature', 'humidity']
        available_critical_cols = [col for col in critical_cols if col in self.processed_df.columns]
        self.processed_df = self.processed_df.dropna(subset=available_critical_cols)
        
        # Calculate AQI for each row
        if all(col in self.processed_df.columns for col in ['pm1', 'pm25', 'temperature', 'humidity']):
            self.processed_df['aqi'] = self.processed_df.apply(
                lambda row: self.calculate_aqi(
                    row['pm1'], row['pm25'], row['temperature'], row['humidity']
                ), axis=1
            )
        
        # Add time-based features
        self.processed_df['hour'] = self.processed_df['datetimeLocal'].dt.hour
        self.processed_df['day_of_week'] = self.processed_df['datetimeLocal'].dt.dayofweek
        self.processed_df['month'] = self.processed_df['datetimeLocal'].dt.month
        self.processed_df['is_weekend'] = (self.processed_df['day_of_week'] >= 5).astype(int)
        
        # Add AQI categories
        if 'aqi' in self.processed_df.columns:
            aqi_categories = self.processed_df['aqi'].apply(lambda x: self.get_aqi_category(x)[0])
            self.processed_df['aqi_category'] = aqi_categories
        
        print(f"✅ Processed dataset shape: {self.processed_df.shape}")
        print(f"📊 Available features: {list(self.processed_df.columns)}")
        
        return self.processed_df
    
    def visualize_data(self):
        """Create comprehensive visualizations"""
        print("📊 Creating visualizations...")
        
        if self.processed_df is None:
            print("❌ No processed data available. Run preprocess_data() first.")
            return
        
        # Set up the plotting style
        plt.style.use('seaborn-v0_8')
        
        # 1. Time series plot of all parameters
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('Air Quality Parameters Over Time', fontsize=16, fontweight='bold')
        
        parameters = ['pm1', 'pm25', 'temperature', 'humidity']
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        
        for i, (param, color) in enumerate(zip(parameters, colors)):
            if param in self.processed_df.columns:
                row, col = i // 2, i % 2
                axes[row, col].plot(self.processed_df['datetimeLocal'], 
                                  self.processed_df[param], 
                                  color=color, alpha=0.7, linewidth=1)
                axes[row, col].set_title(f'{param.upper()}', fontweight='bold')
                axes[row, col].set_xlabel('Date')
                axes[row, col].tick_params(axis='x', rotation=45)
                axes[row, col].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('air_quality_timeseries.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # 2. AQI distribution and categories
        if 'aqi' in self.processed_df.columns:
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
            
            # AQI histogram
            ax1.hist(self.processed_df['aqi'], bins=30, color='#FF6B6B', alpha=0.7, edgecolor='black')
            ax1.set_title('AQI Distribution', fontweight='bold')
            ax1.set_xlabel('AQI Value')
            ax1.set_ylabel('Frequency')
            ax1.grid(True, alpha=0.3)
            
            # AQI categories pie chart
            if 'aqi_category' in self.processed_df.columns:
                category_counts = self.processed_df['aqi_category'].value_counts()
                colors_pie = ['#00E400', '#FFFF00', '#FF7E00', '#FF0000', '#8F3F97', '#7E0023']
                ax2.pie(category_counts.values, labels=category_counts.index, autopct='%1.1f%%',
                       colors=colors_pie[:len(category_counts)])
                ax2.set_title('AQI Categories Distribution', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('aqi_distribution.png', dpi=300, bbox_inches='tight')
            plt.show()
        
        # 3. Correlation heatmap
        numeric_cols = self.processed_df.select_dtypes(include=[np.number]).columns
        correlation_matrix = self.processed_df[numeric_cols].corr()
        
        plt.figure(figsize=(12, 10))
        mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))
        sns.heatmap(correlation_matrix, mask=mask, annot=True, cmap='RdYlBu_r', 
                   center=0, square=True, fmt='.2f')
        plt.title('Correlation Matrix of Air Quality Parameters', fontweight='bold', pad=20)
        plt.tight_layout()
        plt.savefig('correlation_heatmap.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # 4. Hourly and daily patterns
        if 'hour' in self.processed_df.columns and 'aqi' in self.processed_df.columns:
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
            
            # Hourly AQI pattern
            hourly_aqi = self.processed_df.groupby('hour')['aqi'].mean()
            ax1.plot(hourly_aqi.index, hourly_aqi.values, marker='o', linewidth=2, markersize=6)
            ax1.set_title('Average AQI by Hour of Day', fontweight='bold')
            ax1.set_xlabel('Hour')
            ax1.set_ylabel('Average AQI')
            ax1.grid(True, alpha=0.3)
            ax1.set_xticks(range(0, 24, 2))
            
            # Daily AQI pattern
            daily_aqi = self.processed_df.groupby('day_of_week')['aqi'].mean()
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            ax2.bar(range(7), daily_aqi.values, color='#4ECDC4', alpha=0.7)
            ax2.set_title('Average AQI by Day of Week', fontweight='bold')
            ax2.set_xlabel('Day of Week')
            ax2.set_ylabel('Average AQI')
            ax2.set_xticks(range(7))
            ax2.set_xticklabels(days)
            ax2.grid(True, alpha=0.3)
            
            plt.tight_layout()
            plt.savefig('temporal_patterns.png', dpi=300, bbox_inches='tight')
            plt.show()
    
    def prepare_features(self):
        """Prepare features for machine learning"""
        print("🎯 Preparing features for machine learning...")
        
        if self.processed_df is None:
            print("❌ No processed data available. Run preprocess_data() first.")
            return None, None
        
        # Define feature columns
        potential_features = [
            'pm1', 'pm25', 'temperature', 'humidity', 'ultrafine_particles',
            'hour', 'day_of_week', 'month', 'is_weekend'
        ]
        
        # Select available features
        self.feature_columns = [col for col in potential_features if col in self.processed_df.columns]
        
        if 'aqi' not in self.processed_df.columns:
            print("❌ AQI column not found. Cannot prepare features for AQI prediction.")
            return None, None
        
        # Prepare feature matrix and target vector
        X = self.processed_df[self.feature_columns].copy()
        y = self.processed_df['aqi'].copy()
        
        # Handle any remaining missing values
        X = X.fillna(X.mean())
        
        print(f"✅ Features prepared: {self.feature_columns}")
        print(f"📊 Feature matrix shape: {X.shape}")
        print(f"🎯 Target vector shape: {y.shape}")
        
        return X, y
    
    def train_models(self):
        """Train multiple machine learning models"""
        print("🚀 Training machine learning models...")
        
        X, y = self.prepare_features()
        if X is None or y is None:
            print("❌ Feature preparation failed.")
            return
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=None
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Define models
        models = {
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'Linear Regression': LinearRegression()
        }
        
        # Train and evaluate models
        results = {}
        
        for name, model in models.items():
            print(f"Training {name}...")
            
            # Use scaled data for Linear Regression, original for tree-based models
            if name == 'Linear Regression':
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
            
            # Calculate metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            results[name] = {
                'model': model,
                'mse': mse,
                'rmse': rmse,
                'mae': mae,
                'r2': r2,
                'predictions': y_pred
            }
            
            print(f"  📊 {name} Results:")
            print(f"    RMSE: {rmse:.2f}")
            print(f"    MAE: {mae:.2f}")
            print(f"    R²: {r2:.4f}")
            print()
        
        # Find best model
        best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        best_model = results[best_model_name]['model']
        
        print(f"🏆 Best model: {best_model_name} (R² = {results[best_model_name]['r2']:.4f})")
        
        # Store results
        self.models = results
        self.best_model = best_model
        self.best_model_name = best_model_name
        self.X_test = X_test
        self.y_test = y_test
        
        # Feature importance for best model
        if hasattr(best_model, 'feature_importances_'):
            self.plot_feature_importance()
        
        return results
    
    def plot_feature_importance(self):
        """Plot feature importance for the best model"""
        if not hasattr(self.best_model, 'feature_importances_'):
            return
        
        importance = self.best_model.feature_importances_
        indices = np.argsort(importance)[::-1]
        
        plt.figure(figsize=(10, 6))
        plt.title(f'Feature Importance - {self.best_model_name}', fontweight='bold')
        plt.bar(range(len(importance)), importance[indices], alpha=0.7)
        plt.xticks(range(len(importance)), [self.feature_columns[i] for i in indices], rotation=45)
        plt.xlabel('Features')
        plt.ylabel('Importance')
        plt.tight_layout()
        plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def predict_aqi(self, pm1, pm25, temperature, humidity, hour=12, day_of_week=1, month=6, is_weekend=0):
        """
        Predict AQI for given parameters
        
        Args:
            pm1: PM1 concentration (µg/m³)
            pm25: PM2.5 concentration (µg/m³)
            temperature: Temperature (°C)
            humidity: Relative humidity (%)
            hour: Hour of day (0-23)
            day_of_week: Day of week (0=Monday, 6=Sunday)
            month: Month (1-12)
            is_weekend: 1 if weekend, 0 if weekday
        
        Returns:
            Predicted AQI value and category
        """
        if not hasattr(self, 'best_model'):
            print("❌ No trained model available. Run train_models() first.")
            return None, None
        
        # Prepare input data
        input_data = {
            'pm1': pm1,
            'pm25': pm25,
            'temperature': temperature,
            'humidity': humidity,
            'hour': hour,
            'day_of_week': day_of_week,
            'month': month,
            'is_weekend': is_weekend
        }
        
        # Create feature vector with available features
        feature_vector = []
        for feature in self.feature_columns:
            if feature in input_data:
                feature_vector.append(input_data[feature])
            else:
                # Use mean value for missing features
                mean_val = self.processed_df[feature].mean() if feature in self.processed_df.columns else 0
                feature_vector.append(mean_val)
        
        feature_vector = np.array(feature_vector).reshape(1, -1)
        
        # Scale if using Linear Regression
        if self.best_model_name == 'Linear Regression':
            feature_vector = self.scaler.transform(feature_vector)
        
        # Make prediction
        predicted_aqi = self.best_model.predict(feature_vector)[0]
        category, color = self.get_aqi_category(predicted_aqi)
        
        return predicted_aqi, category
    
    def create_interactive_dashboard(self):
        """Create an interactive dashboard using Plotly"""
        print("🎨 Creating interactive dashboard...")
        
        if self.processed_df is None:
            print("❌ No processed data available.")
            return
        
        # Create subplots
        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=('AQI Over Time', 'PM2.5 vs PM1', 
                          'Temperature vs Humidity', 'AQI by Hour',
                          'Parameter Correlations', 'AQI Categories'),
            specs=[[{"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"type": "pie"}]]
        )
        
        # 1. AQI over time
        if 'aqi' in self.processed_df.columns:
            fig.add_trace(
                go.Scatter(x=self.processed_df['datetimeLocal'], 
                          y=self.processed_df['aqi'],
                          mode='lines', name='AQI',
                          line=dict(color='red', width=2)),
                row=1, col=1
            )
        
        # 2. PM2.5 vs PM1 scatter
        if 'pm25' in self.processed_df.columns and 'pm1' in self.processed_df.columns:
            fig.add_trace(
                go.Scatter(x=self.processed_df['pm1'],
                          y=self.processed_df['pm25'],
                          mode='markers', name='PM Relationship',
                          marker=dict(color=self.processed_df.get('aqi', 'blue'),
                                    colorscale='Viridis', showscale=True)),
                row=1, col=2
            )
        
        # 3. Temperature vs Humidity
        if 'temperature' in self.processed_df.columns and 'humidity' in self.processed_df.columns:
            fig.add_trace(
                go.Scatter(x=self.processed_df['temperature'],
                          y=self.processed_df['humidity'],
                          mode='markers', name='Temp vs Humidity',
                          marker=dict(color='green', opacity=0.6)),
                row=2, col=1
            )
        
        # 4. AQI by hour
        if 'hour' in self.processed_df.columns and 'aqi' in self.processed_df.columns:
            hourly_aqi = self.processed_df.groupby('hour')['aqi'].mean().reset_index()
            fig.add_trace(
                go.Bar(x=hourly_aqi['hour'], y=hourly_aqi['aqi'],
                      name='Hourly AQI', marker_color='orange'),
                row=2, col=2
            )
        
        # 5. Correlation heatmap (simplified)
        numeric_cols = ['pm1', 'pm25', 'temperature', 'humidity']
        available_cols = [col for col in numeric_cols if col in self.processed_df.columns]
        if len(available_cols) > 1:
            corr_matrix = self.processed_df[available_cols].corr()
            fig.add_trace(
                go.Heatmap(z=corr_matrix.values,
                          x=corr_matrix.columns,
                          y=corr_matrix.columns,
                          colorscale='RdBu', zmid=0),
                row=3, col=1
            )
        
        # 6. AQI categories pie chart
        if 'aqi_category' in self.processed_df.columns:
            category_counts = self.processed_df['aqi_category'].value_counts()
            fig.add_trace(
                go.Pie(labels=category_counts.index,
                      values=category_counts.values,
                      name="AQI Categories"),
                row=3, col=2
            )
        
        # Update layout
        fig.update_layout(
            height=1200,
            title_text="Air Quality Index Dashboard",
            title_x=0.5,
            showlegend=True
        )
        
        # Save and show
        fig.write_html("aqi_dashboard.html")
        fig.show()
        print("✅ Interactive dashboard saved as 'aqi_dashboard.html'")
    
    def save_model(self, filename='aqi_model.joblib'):
        """Save the trained model"""
        if hasattr(self, 'best_model'):
            model_data = {
                'model': self.best_model,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns,
                'model_name': self.best_model_name
            }
            joblib.dump(model_data, filename)
            print(f"✅ Model saved as '{filename}'")
        else:
            print("❌ No trained model to save.")
    
    def load_model(self, filename='aqi_model.joblib'):
        """Load a saved model"""
        try:
            model_data = joblib.load(filename)
            self.best_model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_columns = model_data['feature_columns']
            self.best_model_name = model_data['model_name']
            print(f"✅ Model loaded from '{filename}'")
        except FileNotFoundError:
            print(f"❌ Model file '{filename}' not found.")
    
    def generate_report(self):
        """Generate a comprehensive analysis report"""
        print("📋 Generating comprehensive report...")
        
        report = []
        report.append("=" * 60)
        report.append("AIR QUALITY INDEX (AQI) ANALYSIS REPORT")
        report.append("=" * 60)
        report.append(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # Dataset summary
        report.append("📊 DATASET SUMMARY")
        report.append("-" * 20)
        report.append(f"Total records: {len(self.processed_df):,}")
        report.append(f"Date range: {self.processed_df['datetimeLocal'].min()} to {self.processed_df['datetimeLocal'].max()}")
        report.append(f"Available parameters: {', '.join([col for col in ['pm1', 'pm25', 'temperature', 'humidity', 'ultrafine_particles'] if col in self.processed_df.columns])}")
        report.append("")
        
        # AQI statistics
        if 'aqi' in self.processed_df.columns:
            report.append("🏭 AQI STATISTICS")
            report.append("-" * 15)
            report.append(f"Average AQI: {self.processed_df['aqi'].mean():.2f}")
            report.append(f"Minimum AQI: {self.processed_df['aqi'].min():.2f}")
            report.append(f"Maximum AQI: {self.processed_df['aqi'].max():.2f}")
            report.append(f"Standard deviation: {self.processed_df['aqi'].std():.2f}")
            report.append("")
            
            # AQI categories
            if 'aqi_category' in self.processed_df.columns:
                report.append("📈 AQI CATEGORY DISTRIBUTION")
                report.append("-" * 25)
                category_counts = self.processed_df['aqi_category'].value_counts()
                for category, count in category_counts.items():
                    percentage = (count / len(self.processed_df)) * 100
                    report.append(f"  {category}: {count:,} ({percentage:.1f}%)")
                report.append("")
        
        # Model performance
        if hasattr(self, 'models'):
            report.append("🤖 MODEL PERFORMANCE")
            report.append("-" * 18)
            for name, metrics in self.models.items():
                report.append(f"{name}:")
                report.append(f"  RMSE: {metrics['rmse']:.2f}")
                report.append(f"  MAE: {metrics['mae']:.2f}")
                report.append(f"  R²: {metrics['r2']:.4f}")
                report.append("")
            
            report.append(f"🏆 Best Model: {self.best_model_name}")
            report.append("")
        
        # Key insights
        report.append("💡 KEY INSIGHTS")
        report.append("-" * 12)
        
        if 'aqi' in self.processed_df.columns and 'hour' in self.processed_df.columns:
            hourly_aqi = self.processed_df.groupby('hour')['aqi'].mean()
            peak_hour = hourly_aqi.idxmax()
            low_hour = hourly_aqi.idxmin()
            report.append(f"• Peak AQI typically occurs at {peak_hour}:00 ({hourly_aqi[peak_hour]:.1f})")
            report.append(f"• Lowest AQI typically occurs at {low_hour}:00 ({hourly_aqi[low_hour]:.1f})")
        
        if 'pm25' in self.processed_df.columns:
            high_pm25_days = (self.processed_df['pm25'] > 35.4).sum()
            report.append(f"• {high_pm25_days} measurements exceed WHO PM2.5 guidelines (>35.4 µg/m³)")
        
        if 'temperature' in self.processed_df.columns and 'humidity' in self.processed_df.columns:
            temp_aqi_corr = self.processed_df[['temperature', 'aqi']].corr().iloc[0, 1] if 'aqi' in self.processed_df.columns else 0
            humidity_aqi_corr = self.processed_df[['humidity', 'aqi']].corr().iloc[0, 1] if 'aqi' in self.processed_df.columns else 0
            report.append(f"• Temperature-AQI correlation: {temp_aqi_corr:.3f}")
            report.append(f"• Humidity-AQI correlation: {humidity_aqi_corr:.3f}")
        
        report.append("")
        report.append("=" * 60)
        
        # Save report
        report_text = "\n".join(report)
        with open('aqi_analysis_report.txt', 'w') as f:
            f.write(report_text)
        
        print("✅ Report saved as 'aqi_analysis_report.txt'")
        print("\n" + report_text)
        
        return report_text

def main():
    """Main execution function"""
    print("🌍 Air Quality Index Machine Learning System")
    print("=" * 50)
    
    # Initialize the system
    aqi_system = AQIMLSystem('openaq_location_4322233_measurments.csv')
    
    # Execute the complete analysis pipeline
    try:
        # 1. Load and explore data
        aqi_system.load_and_explore_data()
        
        # 2. Preprocess data
        aqi_system.preprocess_data()
        
        # 3. Create visualizations
        aqi_system.visualize_data()
        
        # 4. Train machine learning models
        aqi_system.train_models()
        
        # 5. Create interactive dashboard
        aqi_system.create_interactive_dashboard()
        
        # 6. Save the best model
        aqi_system.save_model()
        
        # 7. Generate comprehensive report
        aqi_system.generate_report()
        
        # 8. Demo prediction
        print("\n🎯 DEMO PREDICTION")
        print("-" * 15)
        predicted_aqi, category = aqi_system.predict_aqi(
            pm1=15.0, pm25=25.0, temperature=28.0, humidity=65.0,
            hour=14, day_of_week=2, month=7
        )
        if predicted_aqi is not None:
            print(f"Input: PM1=15.0, PM2.5=25.0, Temp=28°C, Humidity=65%")
            print(f"Predicted AQI: {predicted_aqi:.1f}")
            print(f"Category: {category}")
        
        print("\n✅ Analysis complete! Check the generated files:")
        print("  📊 air_quality_timeseries.png")
        print("  📈 aqi_distribution.png")  
        print("  🔥 correlation_heatmap.png")
        print("  ⏰ temporal_patterns.png")
        print("  🎯 feature_importance.png")
        print("  🌐 aqi_dashboard.html")
        print("  🤖 aqi_model.joblib")
        print("  📋 aqi_analysis_report.txt")
        
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
