pipeline {
agent any
environment {
        FLIGHT_MICROSERVICE_IMAGE = "medalaeddine/flightmicroservice"
        RESERVATION_MICROSERVICE_IMAGE = "medalaeddine/reservationmicroservice"
        GATEWAY_IMAGE = "medalaeddine/gateway"
        DOCKER_REGISTRY_URL = "docker.io/medalaeddine"
        KUBECONFIG_CREDENTIALS = 'myKubeConfig'
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
//stage('Docker Login') {
//            steps {
//                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
//    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
//}
//               }
//            }
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
//stage('Start Services') {
//    steps {
//        sh 'docker-compose up -d'
//    }
//    post {
//    always {
//        sh 'docker-compose down'
//    }
//}
//}
stage('Deploy') {
    steps {
        script {
        withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                       
        echo "Deploying to Kubernetes"
        sh 'kubectl apply -f microservices/flight-deploy.yaml'
        sh 'kubectl apply -f microservices/flight-service.yaml'
        sh 'kubectl apply -f microservices/flight-svc-loadbalancer.yaml'
        // Include additional kubectl commands as necessary
        }
        }
    }
}

stage('Push to Registry') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh "docker login -u $USERNAME -p $PASSWORD"
                sh "docker push ${FLIGHT_MICROSERVICE_IMAGE}"
                sh "docker push ${RESERVATION_MICROSERVICE_IMAGE}"
                sh "docker push ${GATEWAY_IMAGE}"
            }
        }
    }
}

}
}
