""""
@author: Rita Catuxo
"""
import os
import xml.etree.ElementTree as ET


xmlFileName = 'rutasEsquema.xml'

# Verificar la existencia del archivo XML
if os.path.exists(xmlFileName):
    try:
        xmlTree = ET.parse(xmlFileName)
        root = xmlTree.getroot()

    except ET.ParseError as e:
        print(f"Error al analizar el archivo XML: {e}")
    except Exception as e:
        print(f"Se produjo un error inesperado: {e}")
else:
    print(f"El archivo XML {xmlFileName} no se encuentra en la ruta especificada.")



# obtener el directorio del script actual (el directorio del script como directorio de salida)
script_dir = os.path.dirname(os.path.abspath(__file__))
output_directory = script_dir  


# leer el xml
xmlTree = ET.parse(xmlFileName)
root = xmlTree.getroot()


# Definir el espacio de nombres
namespace = "{https://uniovi.es}"


"""
Función para escribir el archivo KML
"""
def write_kml(filename, ruta):
    with open(os.path.join(output_directory, filename), 'w') as f:

        # PARTE 1 - Escritura del prólogo con las etiquetas de encabezado del archivo KML
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        f.write('<Document>\n')
        nombreRuta = ruta.find(f'{namespace}nombre').text
        f.write(f"\t<description>Coordenadas de la ruta {nombreRuta}</description>\n")
        
        # PARTE 2 - Escritura de las coordenadas de la ruta turística

        #coordenada de inicio de ruta
        f.write('<Placemark>\n')
        f.write(f'<name>{ruta.find(f"{namespace}lugar").text}</name>\n')
        f.write('<Point>\n')
        f.write('<coordinates>\n')
        coordenada = ruta.find(f'{namespace}coordenada')
        f.write('{},{},{}\n'.format(
            coordenada.find(f'{namespace}longitud').text,
            coordenada.find(f'{namespace}latitud').text,
            coordenada.find(f'{namespace}altitud').text
        ))
        f.write('</coordinates>\n')
        f.write('</Point>\n')
        f.write('</Placemark>\n')

        

        #coordenadas de los hitos
        for hito in ruta.findall(f'{namespace}hito'):
            f.write('<Placemark>\n')
            f.write(f'<name>{hito.find(f"{namespace}nombre").text}</name>\n')
            f.write('<Point>\n')
            f.write('<coordinates>\n')
            coordenada_hito = hito.find(f'{namespace}coordenada')
            f.write('{},{},{}\n'.format(
                coordenada_hito.find(f'{namespace}longitud').text,
                coordenada_hito.find(f'{namespace}latitud').text,
                coordenada_hito.find(f'{namespace}altitud').text
            ))
            f.write('</coordinates>\n')
            f.write('</Point>\n')
            f.write('</Placemark>\n')



        # PARTE 3 - Escritura del epílogo con las etiquetas de cierre del archivo KML
        f.write('</Document>\n')
        f.write('</kml>\n')



# Iterar sobre las rutas y generar los archivos KML
for i, ruta in enumerate(root.findall(f'{namespace}ruta')):
    write_kml(f'ruta{i+1}.kml', ruta)





print("Los archivos KML se han generado.")
print("Gracias por usar xml2kml")
print("Autora: Rita Fernández-Catuxo Ortiz UO 284185")