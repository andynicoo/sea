FROM chenhai-group-docker.pkg.coding.net/kuajingzhidao/kjzd/nodejs:14.20.0-buster-slim
MAINTAINER EOI
ADD . /app/
WORKDIR /app
#RUN yarn
#RUN yarn prod:build

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

EXPOSE 3000
CMD ["yarn", "prod:start"]

# docker run -d -p 3000:3000 --name website website:1.0.0
# docker build -t website:1.0.0 .


#FROM nginx:1.21.0-alpine
#EXPOSE 80
#EXPOSE 443

#COPY dist/ /usr/share/nginx/html
#COPY docker/nginx.conf /etc/nginx/nginx.conf