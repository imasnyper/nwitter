from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.http import HttpResponse
import json

from .forms import ProfileCreationForm

def signup(request):
    if request.method == 'POST':
        form = ProfileCreationForm(json.loads(request.body))
        if form.is_valid():
            form.save()
            return HttpResponse()
        else:
            return HttpResponse(form.errors)