FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /var/task

COPY . .


RUN npm install yarn --global
COPY package.json yarn.lock ./
RUN yarn install

# # Base image
# FROM node:18.16.0

# # Set working directory
# WORKDIR /app

# # Copy package.json and yarn.lock to container

# # Install dependencies
# RUN yarn install

# # Copy the rest of the app files to container
COPY . .

# # Build the app
# RUN yarn build

# # Set environment variables
# ENV NODE_ENV production
# ENV PORT 3000

# # Expose the port
# EXPOSE 3000

# # Start the app
CMD [ "index.handler"]
# CMD [ ]