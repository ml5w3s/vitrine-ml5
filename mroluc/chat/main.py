# This is a sample Python script.

# Press Ctrl+F5 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

# Importando bibliotecas necessárias

import os, json, random
from nltk.chat.util import Chat, reflections

# Definindo pares de perguntas e respostas a partir de chatbot_responses.json
data_path = os.path.join(os.path.dirname(__file__), "chatbot_responses.json")
with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

pairs = []
fallback_responses = ["Desculpe, não entendi. Por favor, tente novamente."]
for intent in data.get("intents", []):
    tag = intent.get("tag", "")
    patterns = intent.get("patterns", [])
    responses = intent.get("responses", [])
    if tag == "fallback":
        if responses:
            fallback_responses = responses
        continue
    for pattern in patterns:
        pairs.append([pattern, responses])

# Criando o chatbot

chatbot = Chat(pairs, reflections)

# Iniciando o chatbot

print("Bem-vindo ao Chatbot do MR. Oluc!")

print("Digite 'sair' para encerrar o atendimento.")

while True:

  user_input = input("Você: ")

  if user_input.lower() == "sair":

      print("Chatbot: Até logo! Espero ter ajudado.")

      break

  response = chatbot.respond(user_input.lower())

  if response:

      print(f"Chatbot: {response}")

  else:

      print(f"Chatbot: {random.choice(fallback_responses)}")

# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    chatbot

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
