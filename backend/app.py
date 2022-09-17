import requests
filler_words = ["um", "uh", "hmm", "mhm", "uh huh", "ahh", "like", "you know"]
mysp = __import__("my-voice-analysis") # need to pip install my-voice-analysis

from flask import Flask
import datetime
app = Flask(__name__)

def read_file(filename, chunk_size=5242880):
    with open(filename, 'rb') as _file:
        while True:
            data = _file.read(chunk_size)
            if not data:
                break
            yield data
            
def get_url(filename): 
    headers = {'authorization': "8723d8b0c8104a8fa0f6c8487d79b26c"}
    response = requests.post('https://api.assemblyai.com/v2/upload',
                        headers=headers,
                        data=read_file(filename))
    return response.json()['upload_url']

@app.route('/time')
def get_current_time():
    return {'time': datetime.datetime.now()}

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route('/analyze')
def get_analysis(): 
   return assembly_analysis(get_url('7510.wav'))


@app.route('/voice')
def get_voice_analysis(): 
   return voice_analysis(get_url('7510.wav'))

def assembly_analysis(url):
    req_endpoint = "https://api.assemblyai.com/v2/transcript"
    
    req_json = {
        "audio_url": url,
        "sentiment_analysis": True,
        "disfluencies": True
    }
    req_headers = {
        "authorization": "8723d8b0c8104a8fa0f6c8487d79b26c",
        "content-type": "application/json"
    }
    req_response = requests.post(req_endpoint, json=req_json, headers=req_headers)
    # print(req_response.json())
    
    curr_id = req_response.json()['id']
    status = ''

    while status != 'completed': 
        check_endpoint = f'https://api.assemblyai.com/v2/transcript/{curr_id}'
        check_headers = {
            # "authorization": "YOUR-API-TOKEN",
            "authorization": "8723d8b0c8104a8fa0f6c8487d79b26c",
        }
        check_response = requests.get(check_endpoint, headers=check_headers)
        status = check_response.json()['status']

    text = check_response.json()['text']
    sentiment = check_response.json()['sentiment_analysis_results']
    #print(check_response.json())
    return [text, sentiment]

def voice_analysis(filename):
    p=filename # Audio File title, should be filename
    c=r"/audio/" # Path to the audio directory
    return [mysp.mysppron(p,c), mysp.mysptotal(p,c)]