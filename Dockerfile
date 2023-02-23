FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
# Set the PORT environment variable to the value of the Heroku $PORT variable
ENV PORT $PORT
EXPOSE $PORT
CMD ["npm", "run", "start"]