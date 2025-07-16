from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer, EmailTokenObtainPairSerializer
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = UserProfileSerializer(request.user)
        return Response(user.data, status=status.HTTP_200_OK)

class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

