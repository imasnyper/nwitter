from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse
import json

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(json.loads(request.body))
        if form.is_valid():
            form.save()
            # username = form.cleaned_data.get('username')
            # raw_password = form.cleaned_data.get('password1')
            # user = authenticate(username=username, password=password)
            # login(request, user)
            # return redirect('')
            return HttpResponse()
        else:
            return HttpResponse(form.errors)