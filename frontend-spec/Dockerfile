FROM nginx:1.21.0-alpine
EXPOSE 80
EXPOSE 443

# copy pom.xml and wildcards to avoid this command failing if there's no target/lib directory
#COPY erp-acc-platform/pom.xml /

# NOTE we assume there's only 1 jar in the target dir
# but at least this means we don't have to guess the name
# we could do with a better way to know the name - or to always create an app.jar or something
COPY .vuepress/dist/ /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
