FROM node:20-slim
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm install -g nodemon
EXPOSE 3001
# need to specify -L so nodemon detects file changes in docker container
ENTRYPOINT ["nodemon", "src/index.ts"]
CMD ["-L"]