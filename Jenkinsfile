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
echo "Building Docker Images"
echo "Building Reservation Microservice Docker Image"
sh 'docker build -f microservices/reservationDockerfile t ${RESERVATION_MICROSERVICE_IMAGE} .'

echo "Building Flight Microservice Docker Image"
sh 'docker build  -t ${FLIGHT_MICROSERVICE_IMAGE} . .'

echo "Building Gateway Docker Image"
sh 'docker build -f gatewayDockerfile -t ${GATEWAY_IMAGE} .'

// Ajoutez les commandes de build ici

}
}
stage('Deploy') {
steps {
echo "Déploiement du projet"
// Ajoutez les commandes de déploiement ici
}

stage('Testing') {
    steps {
        echo "Running Tests"
        sh 'npm test'
    }
}

stage('Push to Registry') {
    steps {
        echo "Pushing Images to DockerHub"
        sh 'docker push ${FLIGHT_MICROSERVICE_IMAGE}'
        sh 'docker push ${RESERVATION_MICROSERVICE_IMAGE}'
        sh 'docker push ${GATEWAY_IMAGE}'
    }
}

}
}
}
