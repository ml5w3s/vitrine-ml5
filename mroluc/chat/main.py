# This is a sample Python script.

# Press Ctrl+F5 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

# Importando bibliotecas necessárias

from nltk.chat.util import Chat, reflections

# Definindo pares de perguntas e respostas

pairs = [

  ["olá", ["Olá! Como posso ajudá-lo hoje?"]],

  ["como faço para renovar meu documento?",

   ["Você pode renovar seus documentos acessando o site do órgão responsável ou comparecendo a uma unidade próxima."]],

  ["quais documentos eu preciso?",

   ["Você precisará de um documento de identificação, comprovante de residência e CPF."]],

  ["obrigado", ["De nada! Estou aqui para ajudar."]],

  ["tchau", ["Até logo! Tenha um ótimo dia."]]

]

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

  response = chatbot.respond(user_input)

  if response:

      print(f"Chatbot: {response}")

  else:

      print("Chatbot: Desculpe, não entendi sua pergunta. Por favor, tente novamente, de outra forma.")

# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    chatbot

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
