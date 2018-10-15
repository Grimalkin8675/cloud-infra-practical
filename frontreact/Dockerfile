# mynpm:custom
FROM ubuntu:xenial

RUN apt update
RUN apt install -yq curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt install -yq nodejs

COPY ./entrypoint.sh /usr/local/bin/

WORKDIR /frontreact

ENTRYPOINT [ "bash", "entrypoint.sh" ]
CMD [ "" ]
