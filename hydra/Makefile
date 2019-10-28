SHELL=/bin/bash

HYDRA_URL_ADMIN := http://127.0.0.1:4445/


create-client:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} --secret ${client_secret} -g client_credentials

create-client-without-secret:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} -g client_credentials

create-client-mobile:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} --token-endpoint-auth-method none -g client_credentials