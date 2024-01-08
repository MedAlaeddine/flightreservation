pipeline {
agent any
environment {
        FLIGHT_MICROSERVICE_IMAGE = "medalaeddine/flightmicroservice"
        RESERVATION_MICROSERVICE_IMAGE = "medalaeddine/reservationmicroservice"
        GATEWAY_IMAGE = "medalaeddine/gateway"
        DOCKER_REGISTRY_URL = "docker.io/medalaeddine"
    }
triggers {
pollSCM('*/5 * * * *') // Vérifier toutes les 5 minutes
}
stages {
stage('Checkout') {
steps {
echo "Récupération du code source"
checkout scm
}
}
stage('Build') {
steps {
echo "Build du projet"

// Ajoutez les commandes de build ici

}
}
stage('Deploy') {
steps {
echo "Déploiement du projet"
// Ajoutez les commandes de déploiement ici
}
}
}
}
