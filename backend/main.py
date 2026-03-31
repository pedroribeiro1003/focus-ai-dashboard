from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = []

@app.get("/")
def home():
    return {"message": "FocusAI rodando 🚀"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(task: dict):
    task["done"] = False
    tasks.append(task)
    return {"message": "Tarefa criada"}

@app.put("/tasks/{index}")
def update_task(index: int):
    tasks[index]["done"] = not tasks[index]["done"]
    return {"message": "Atualizada"}