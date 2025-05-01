build:
	docker build -t auth-web-app .

run:
	docker run --name auth-web-app -p 80:3000 -d auth-web-app

remove:
	docker stop auth-web-app
	docker rm auth-web-app  

dcu:
	docker-compose up -d

dcd:
	docker-compose down
	
dcdv:
	docker-compose down -v 
	
deploy: dcd build dcu

