FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 
# RUN npm install --omit=dev

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
# If you want to run the app in development mode, use:
# CMD ["npm", "run", "dev"]