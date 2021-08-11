import tweepy
import websocket
import key
import json

consumer_key = key.twkey["CK"]
consumer_secret = key.twkey["CS"]
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)

access_token = key.twkey["AK"]
access_secret = key.twkey["AS"]
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)

ids = api.friends_ids("305_tb_")
ids_str = [str(n) for n in ids]
ids_str.append("920915076369891328")

#ws
ws = websocket.WebSocket()
url = 'ws://localhost:8081/'
def send_ws(text):
	ws.send(text)

ws.connect(url)
print("------------\n")

class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		if status.user.id_str in ids_str or status.user.id_str == "920915076369891328": #RTされたものでないか判定
			if hasattr(status, "retweeted_status"): #リツイートかどうか判定
				try:
					txt = "RT:@" + status.retweeted_status.user.screen_name + "\n" + status.retweeted_status.extended_tweet["full_text"]
				except AttributeError:
					txt = "RT:@" + status.retweeted_status.user.screen_name + "\n" + status.retweeted_status.text

			else:
				try:
					txt = status.extended_tweet["full_text"]
				except AttributeError:
					txt = status.text

			if status.in_reply_to_screen_name == None: #リプライでない場合
				head = ""

			elif status.in_reply_to_screen_name == status.user.screen_name: #スレッドの場合
				head = ""

			else: #リプライである場合
				head = "Reply to @" + status.in_reply_to_screen_name
				tw_s = txt.find(" ") + 1
				txt = txt[tw_s:]

			txt = txt.replace("&amp;", "&") #&amp;の書き換え
			data={}
			data["name"]=status.user.name
			data["screen_name"]=status.user.screen_name
			data["head"]=head
			data["text"]=txt
			print(json.dumps(status._json,ensure_ascii=False))
			ws.send(json.dumps(data,ensure_ascii=False))

myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
myStream.filter(follow=ids_str)
ws.close()