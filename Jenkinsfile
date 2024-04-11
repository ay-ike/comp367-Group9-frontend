pipeline {
    agent any

    // triggers {
    //     cron('H/5 * * * *') // Poll SCM every 5 minutes
    // }

    tools {
        nodejs 'NodeJS'
    }

    environment {     
        IMAGE_NAME = "sorada1111/eshop:front1-dev"
        IMAGE_NAME_2 = "sorada1111/eshop:front2-dev"
        IMAGE_NAME_VERSION = "sorada1111/eshop:front1-dev-${BUILD_ID}"
        IMAGE_NAME_VERSION_2 = "sorada1111/eshop:front2-dev-${BUILD_ID}"
         
        
    }

    stages {
        stage('Checkout code') {
            steps {
                
                git branch: 'master', url: 'https://github.com/soradaprathan/comp367-Group9-frontend.git'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

//     stage('sonar'){     
//         steps {
//             script {
                
//                 def scannerHome = tool 'SonarQube';
//                 withSonarQubeEnv('SonarQube') {
//                     bat "${scannerHome}/bin/sonar-scanner"
//                 }
//             }
//         }
//     }

//  stage('Test and Coverage') {
//             steps {
//                 script {
//                     // Install project dependencies
//                     bat 'npm install'
//                     // Run Jest tests with coverage. It will not fail if there are no tests, due to Jest configuration.
//                     bat 'npm test'
//                 }
//                 //cobertura coberturaReportFile: '**/coverage/lcov.info'
//             }
//         }
    // stage('Docker Build') {
    //         steps {
    //            script {                  
    //                 bat "docker build -t ${IMAGE_NAME_VERSION} -f Dockerfile ."   
    //                 bat "docker build -t ${IMAGE_NAME_VERSION_2} -f Dockerfile2 ."                 
    //             }
    //         }
    //     }
        
    //     stage('Docker Login') {
    //         steps {
    //            script {    
    //                   withCredentials([usernamePassword(credentialsId: 'dockerhubtoken', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
    //                   bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
    //                   }
    //             }
    //         }
    //     }
        
    //     stage('Docker Push') {
    //         steps {
    //             script {
    //                 bat "docker tag ${IMAGE_NAME_VERSION} ${IMAGE_NAME}"
    //                 bat "docker push ${IMAGE_NAME}"
    //                 bat "docker push ${IMAGE_NAME_VERSION}"                 
    //             }       
    //         }
    //     }

    //     stage('Docker Pull') {
    //         steps {
    //             script {
                   
    //                 bat "docker pull ${IMAGE_NAME}"
                               
    //             }       
    //         }
    //     }

    //     stage('Deployment DEV') {
    //         steps {
    //             script {
    //                 bat "docker compose -f docker-compose.yaml down"
    //                 bat "docker compose -f docker-compose.yaml up -d --build"
                               
    //             }       
    //         }
    //     }

    //     stage('Deployment QAT') {
    //         steps {
    //             script {
    //                 bat "docker tag sorada1111/eshop:backend-dev sorada1111/eshop:backend-qat"
    //                 bat "docker push sorada1111/eshop:backend-qat"      
    //                 bat "docker pull sorada1111/eshop:backend-qat"    
    //                 bat "docker compose -f docker-compose-qat.yaml down"
    //                 bat "docker compose -f docker-compose-qat.yaml up -d --build"      
    //             }       
    //         }
    //     }

    //     stage('Deployment Staging') {
    //         steps {
    //             script {
    //                 bat "docker tag sorada1111/eshop:backend-dev sorada1111/eshop:backend-staging"
    //                 bat "docker push sorada1111/eshop:backend-staging"      
    //                 bat "docker pull sorada1111/eshop:backend-staging"    
    //                 bat "docker compose -f docker-compose-staging.yaml down"
    //                 bat "docker compose -f docker-compose-staging.yaml up -d --build"      
    //             }       
    //         }
    //     }


    //     stage('Deployment Production') {
    //         steps {
    //             script {
    //                 bat "docker tag sorada1111/eshop:backend-dev sorada1111/eshop:backend-prod"
    //                 bat "docker push sorada1111/eshop:backend-prod"      
    //                 bat "docker pull sorada1111/eshop:backend-prod"    
    //                 bat "docker compose -f docker-compose-prod.yaml down"
    //                 bat "docker compose -f docker-compose-prod.yaml up -d --build"      
    //             }       
    //         }
    //     }

        

    }

    post {
        always {
           echo 'The pipeline is finished.'
        }
    }
}
