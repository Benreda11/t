#!/bin/bash

# Initialise la base de données
python init_db.py

# Lance l'application Gunicorn
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app