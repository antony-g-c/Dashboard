# Vendor Dashboard

This repository contains the active vendor dashboard project in `react-django2`.

## Stack

- Frontend: React (Create React App)
- Backend: Django + Django REST Framework
- Database: SQLite

## Project Structure

- `react-django2/`: main app
- `react-django2/src/`: React frontend source
- `react-django2/backend2/`: Django backend source
- `_archive/`: archived prototype backups

## Run Locally

### 1) Start Django backend

```bash
cd "react-django2/backend2"
source virt/bin/activate
python3 manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`.

### 2) Start React frontend

In a second terminal:

```bash
cd "react-django2"
npm start
```

Frontend runs on `http://localhost:3000`.

## Optional: Run both with tmux

```bash
tmux new -s vendor
```

Then split pane (`Ctrl+b`, then `%`) and run backend in one pane, frontend in the other.

## Notes

- Sales chart supports single-period view and compare mode.
- Compare mode requires both selected periods to have the same number of days.
- Sample data script: `react-django2/backend2/sample_data.py`
