""""
@author: Rita Catuxo
"""
import xml.etree.ElementTree as ET
import os


 
# Verificar la existencia del archivo XML
xmlFileName = 'rutasEsquema.xml'

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

distanciasFinales = []
altitudesFinales = []


# funciones para las distintas parte del archivo SVG
def prologo(file):
    file.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
    file.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')

def textSVG(file, x, y, name):
    file.write('<text x="' + str(x+50) + '" y="' + str(y) + '" style="writing-mode: tb; glyph-orientation-vertical: 0;">\n')
    file.write(name + "\n")
    file.write('</text>\n')




# Iterar a través de los nodos XML y generar los archivos SVG
for i, ruta in enumerate(root.findall(f'.//{namespace}ruta')):

    # Crear archivo SVG
    nombre_archivo = f'perfil{i+1}.svg'

    with open(nombre_archivo, 'w') as f:

        # ==== PRÓLOGO CON LAS ETIQUETAS DE ENCABEZADO
        prologo(f)

        
        # ========== PUNTOS ========== (COORDENADAS DE LA RUTA TURISTICA)
        f.write('<polyline points="\n')
        
    
        

        altitudMaxima = 150 # altura maxima (la mayor altitud + 10)
        distancia = 10 + 50

        #punto inicial
        f.write(f'{distancia},{altitudMaxima}\n')

        #altitud del punto de comienzo
        altitudInicialRuta = int(ruta.find(f'.//{namespace}coordenada/{namespace}altitud').text)
        f.write(f'{distancia},{altitudMaxima-altitudInicialRuta}\n')

        distanciaSumanda = distancia
        for hito in ruta.findall(f'.//{namespace}hito'):
            coordenada = hito.find(f'.//{namespace}coordenada')
        
            altitud = int(hito.find(f'.//{namespace}coordenada/{namespace}altitud').text)
            altitud = altitudMaxima - altitud # restar para que aparezca hacia arriba
            distanciaAnterior = float(hito.find(f'.//{namespace}distanciaAnterior').text)*50.0 + 50  # *50 para mayor escala
            distanciaSumanda += distanciaAnterior # nombres.append(hito.find(f'.//{namespace}nombre').text)
            f.write(f'{distanciaSumanda},{altitud}\n')

        #puntos finales
        f.write(f'{distanciaSumanda},{altitudMaxima}\n')
        f.write(f'{distancia},{altitudMaxima}\n') # para que la linea sea recta

        f.write('"\n')        
        f.write('style="fill:white;stroke:red;stroke-width:4" />\n')


        # ======== TEXTO =========
        comienzoTexto = "155"

        #punto de comienzo   
        nombrePuntoInicial = ruta.find(f'.//{namespace}lugar').text
        textSVG(f, distancia, comienzoTexto, nombrePuntoInicial)

        #puntos de los hitos 
        
        distanciaSumanda = distancia
        for hito in ruta.findall(f'.//{namespace}hito'):
            nombre = hito.find(f'.//{namespace}nombre').text
            distanciaAnterior = float(hito.find(f'.//{namespace}distanciaAnterior').text)*50.0 + 50
            distanciaSumanda += distanciaAnterior
            textSVG(f, distanciaSumanda, comienzoTexto, nombre)  

        #punto final
        #textSVG(f, distanciaSumanda, comienzoTexto, "Final")



        # ======= EPILOGO  ========- ETIQUETA DE CIERRE
        f.write('</svg>')







