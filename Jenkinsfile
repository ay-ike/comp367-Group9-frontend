pipeline {
    agent any

    // triggers {
    //     cron('H/2 * * * *') // Poll SCM every 2 minutes
    // }

    tools {
        nodejs 'NodeJS'
    }

    environment {     
        IMAGE_NAME = "amonte13/eshop:front1-dev"
        // IMAGE_NAME_2 = "amonte13/eshop:front2-dev"
        IMAGE_NAME_VERSION = "amonte13/eshop:front1-dev-${BUILD_ID}"
        // IMAGE_NAME_VERSION_2 = "amonte13/eshop:front2-dev-${BUILD_ID}"                
    }

    stages {
        stage('Checkout code') {
            steps {
                
                git branch: 'main', url: 'https://github.com/ay-ike/comp367-Group9-frontend'
            }
        }

    stage('Checkout') {
        steps {
            checkout scm // This step checks out the source code from the configured SCM repository
        }
    }

    stage('sonar'){     
        steps {
            script {
                
                def scannerHome = tool 'SonarQube';
                withSonarQubeEnv('SonarQube') {
                    bat "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
    }


    stage('Docker Build') {
            steps {
               script {                  
                    bat "docker build -t ${IMAGE_NAME_VERSION} -f Dockerfile ."   
                    bat "docker build -t ${IMAGE_NAME_VERSION_2} -f Dockerfile2 ."                 
                }
            }
        }
        
    stage('Test and Coverage') {
        steps {
            script {                              
                bat 'npm ci'                    
                bat 'npx jest --coverage --coverageReporters=clover' 
            }
        }
    }
           
        stage('Docker Login') {
            steps {
               script {    
                      withCredentials([usernamePassword(credentialsId: 'dockerhubtoken', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                      bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                      }
                }
            }
        }
        
        stage('Docker Push') {
            steps {
                script {
                    bat "docker tag ${IMAGE_NAME_VERSION} ${IMAGE_NAME}"
                    bat "docker push ${IMAGE_NAME}"
                    bat "docker push ${IMAGE_NAME_VERSION}"      
                    bat "docker tag ${IMAGE_NAME_VERSION_2} ${IMAGE_NAME_2}"
                    bat "docker push ${IMAGE_NAME_2}"
                    bat "docker push ${IMAGE_NAME_VERSION_2}"            
                }       
            }
        }

        stage('Docker Pull') {
            steps {
                script {
                   
                    bat "docker pull ${IMAGE_NAME}"
                    bat "docker pull ${IMAGE_NAME_2}"
                               
                }       
            }
        }

        stage('Deployment DEV') {
            steps {
                script {
                    bat "docker compose -f docker-compose.yaml down"
                    bat "docker compose -f docker-compose.yaml up -d --build"
                               
                }       
            }
        }

         stage('Deployment QAT') {
             steps {
                 script {
                     bat "docker tag amonte13/eshop:front1-dev amonte13/eshop:front1-qat"
                     bat "docker push amonte13/eshop:front1-qat"      
                     bat "docker pull amonte13/eshop:front1-qat"  
                     bat "docker tag amonte13/eshop:front2-dev amonte13/eshop:front2-qat"
                     bat "docker push amonte13/eshop:front2-qat"      
                     bat "docker pull amonte13/eshop:front2-qat"    
                     bat "docker compose -f docker-compose-qat.yaml down"
                     bat "docker compose -f docker-compose-qat.yaml up -d --build"      
                 }       
             }
         }

        stage('Deployment Staging') {
            steps {
                script {

                    bat "docker tag amonte13/eshop:front1-dev amonte13/eshop:front1-staging"
                    bat "docker push amonte13/eshop:front1-staging"      
                    bat "docker pull amonte13/eshop:front1-staging"  
                    bat "docker tag amonte13/eshop:front2-dev amonte13/eshop:front2-staging"
                    bat "docker push amonte13/eshop:front2-staging"      
                    bat "docker pull amonte13/eshop:front2-staging"     
                    bat "docker compose -f docker-compose-staging.yaml down"
                    bat "docker compose -f docker-compose-staging.yaml up -d --build"      
                }       
            }
        }


        stage('Deployment Production') {
            steps {
                script {

                    bat "docker tag amonte13/eshop:front1-dev amonte13/eshop:front1-prod"
                    bat "docker push amonte13/eshop:front1-prod"      
                    bat "docker pull amonte13/eshop:front1-prod"  
                    bat "docker tag amonte13/eshop:front2-dev amonte13/eshop:front2-prod"
                    bat "docker push amonte13/eshop:front2-prod"      
                    bat "docker pull amonte13/eshop:front2-prod"   
                    bat "docker compose -f docker-compose-prod.yaml down"
                    bat "docker compose -f docker-compose-prod.yaml up -d --build"      
                }       
            }
        }

        

    }

    post {
        always {
            // Clover coverage report configuration
            clover(
                cloverReportDir: 'coverage',
                cloverReportFileName: 'clover.xml',
                healthyTarget: [
                    methodCoverage: 70,
                    conditionalCoverage: 80,
                    statementCoverage: 80
                ],
                unhealthyTarget: [
                    methodCoverage: 50,
                    conditionalCoverage: 50,
                    statementCoverage: 50
                ],
                failingTarget: [
                    methodCoverage: 0,
                    conditionalCoverage: 0,
                    statementCoverage: 0
                ]
            )

            echo 'The pipeline is finished.'
        }
    }
}
