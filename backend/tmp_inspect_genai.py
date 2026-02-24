import google.generativeai as genai
import inspect
print('attrs:', [a for a in dir(genai) if not a.startswith('_')])
print('generate_text callable:', callable(getattr(genai,'generate_text',None)))
print('generate_text sig:', inspect.signature(genai.generate_text))
print('get_model sig:', inspect.signature(genai.get_model))
try:
    m = genai.get_model('gemini-pro')
    print('get_model returned type:', type(m))
    print('model attrs:', [a for a in dir(m) if not a.startswith('_')])
except Exception as e:
    print('get_model call failed:', repr(e))
