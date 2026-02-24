import google.generativeai as genai
import inspect
print('configure sig:', inspect.signature(genai.configure))
print('configure doc:', genai.configure.__doc__[:400])
