import requests
filler_words = ["um", "uh", "hmm", "mhm", "uh huh", "ahh", "like", "you know"]

import flask
import datetime
app = flask.Flask(__name__)

@app.route('/analyze', methods=['GET'])
def get_analysis(): 
    filename = flask.request.args.get('filename')
    return flask.jsonify(assembly_analysis(get_url(filename)))

@app.route('/amplitude_graph', methods=['GET'])
def graph_amplitude():
    filename = flask.request.args.get('filename')
    return graph_amplitude(filename)

@app.route('/loudness', methods=['GET'])
def loudness():
    filename = flask.request.args.get('filename')
    loudness = loudness_unit(filename)
    return flask.jsonify({'loudness': loudness})

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

from scipy.io.wavfile import read
import matplotlib.pyplot as plt
import numpy as np

def graph_amplitude(file_path): 
    samplerate, data = read(file_path)
    # samplerate #echo samplerate
    # data #echo data -> note that the data is a single dimensional array
    duration = len(data)/samplerate
    time = np.arange(0,duration,1/samplerate) #time vector
    
    plt.plot(time,data)
    plt.xlabel('Time [s]')
    plt.ylabel('Amplitude')
    plt.title('7510.wav')
    plt.show()

import soundfile as sf
import pyloudnorm as pyln

def loudness_unit(file_path): 
    data, rate = sf.read(file_path)
    meter = pyln.Meter(rate) 
    # Loudness Unit Full Scale 
    # The less negative the value, the higher the average level.
    # -9 to -13 is the ideal range
    loudness = meter.integrated_loudness(data)
    return loudness