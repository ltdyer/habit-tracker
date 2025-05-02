# originally this was an alpine image but running npm install for mui was very slow
# changing it to slim made it significantly faster
FROM node:20-slim
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]