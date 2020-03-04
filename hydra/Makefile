SHELL=/bin/bash

HYDRA_URL_ADMIN := http://127.0.0.1:4445/
HOST_NAME := 127.0.0.1

create-client:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} --secret ${client_secret} --callbacks ${callback} --grant-types ${grant_types} --response-types ${response_types} --scope ${scope} -g client_credentials

create-client-without-secret:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} --callbacks ${callback} --grant-types ${grant_types} --response-types ${response_types} --scope ${scope} -g client_credentials

create-client-mobile:
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --id ${client_id} --token-endpoint-auth-method none -g client_credentials

start-login-server:
	/usr/bin/hydra token user --client-id ${client_id} --client-secret ${client_secret} --endpoint http://${HOST_NAME}:4444/ --port 5555 --scope openid,offline_access,offline

create-base-client:
	make create-client-without-secret client_id=${client_id} callback=${callback} response_types=token,code,id_token grant_types=authorization_code,refresh_token,client_credentials,implicit scope=openid,offline_access,offline

introspect-token:
	/usr/bin/hydra token introspect ${token} --endpoint ${HYDRA_URL_ADMIN} --client-id ${client_id}

add-admin-client:
	#Example: /usr/bin/hydra clients create --endpoint http://127.0.0.1:4445/ --id ${ADMIN_OAUTH2_CLIENT_ID} --secret ${ADMIN_OAUTH2_CLIENT_SECRET} --callbacks https://${HOST_NAME}/admin/callback --response-types token,code --grant-types authorization_code,refresh_token --scope openid,offline --token-endpoint-auth-method client_secret_post
	/usr/bin/hydra clients create --endpoint ${HYDRA_URL_ADMIN} --client-id ${client_id} --callbacks ${callback} --response-types token,code --grant-types authorization_code,refresh_token --scope openid,offline --token-endpoint-auth-method client_secret_post