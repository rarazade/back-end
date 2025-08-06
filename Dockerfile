FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN mkdir -p uploads

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
