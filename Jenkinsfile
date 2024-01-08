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
stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'bde49bf0-d3d1-40f3-ace4-9d3e13f0ba3d', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
}
                }
            }
        }
stage('Build') {
steps {
echo "Building Docker Images"
echo "Building Reservation Microservice Docker Image"
sh 'docker build -f microservices/reservationDockerfile -t medalaeddine/reservationmicroservice .'

echo "Building Flight Microservice Docker Image"
sh 'docker build  -t medalaeddine/flightmicroservice .'

echo "Building Gateway Docker Image"
sh 'docker build -f gatewayDockerfile -t medalaeddine/gateway .'

// Ajoutez les commandes de build ici

}
}
stage('Deploy') {
steps {
echo "Déploiement du projet"
// Ajoutez les commandes de déploiement ici
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
