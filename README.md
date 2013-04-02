linden-client-todoitems
=======================

Prueba de tecnología

Esta la app cliente, es una interface creada en html5+Css+Javascript,
funciona en un servidor que tenga instalado Apache 2 como viene por defecto,
los modulos mas importantes para que el pueda hacer pedidos al backend son:

- mod_rewrite
- proxy_module

El cliente debe estar en instalado en un virtual host del apache, el archivo .htaccess 
tiene la direccion de url del servidor backend "http://servertasks.alejojm.net", esta url
debe ser cambiada por la url del backend.

La url donde pueden ver funcionando el proyecto es:
http://clientasks.alejojm.net/