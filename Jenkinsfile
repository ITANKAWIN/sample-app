pipeline {
    agent any

    environment {
        // Docker image configuration
        DOCKER_IMAGE = 'sample-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'localhost:5000'

        // SonarQube configuration
        SONAR_PROJECT_KEY = 'sample-app'
        SONAR_PROJECT_NAME = 'Sample App POC'
        SONAR_HOST_URL = 'http://sonarqube:9000'
    }

    stages {        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner' // ชื่อ tool ที่กำหนดใน Global Tool Configuration
                    withSonarQubeEnv('SonarQube') { // ชื่อ SonarQube server ที่กำหนดใน Configure System

                        def sonarProjectKey = 'sample-app' // ชื่อ Project ที่สร้างใน SonarQube

                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${sonarProjectKey} -Dsonar.sources=. -Dsonar.exclusions=node_modules/**,Dockerfile,Jenkinsfile*,*.md,tests/** -Dsonar.projectName='${SONAR_PROJECT_NAME}' -Dsonar.projectVersion=${BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                echo 'Skipping SonarQube Quality Gate for POC...'
                // สำหรับ POC เราข้าม Quality Gate ไปก่อน
                echo 'Quality Gate would be checked here in production'
            }
        }

        stage('Build Summary') {
            steps {
                echo 'Build completed successfully!'
                echo 'SonarQube analysis has been sent'
                echo 'Check SonarQube dashboard at: http://localhost:9000'
            }
        }
}
    post {
        always {
            echo 'Pipeline completed.'

            // Clean up workspace
            cleanWs()

            // Skip Docker cleanup since we're not building images
            echo 'Cleanup completed'
        }
        success {
            echo 'Pipeline succeeded! 🎉'
            echo 'SonarQube analysis completed successfully'
            echo 'Check your project at: http://localhost:9000/dashboard?id=sample-app'
        }

        failure {
            echo 'Pipeline failed! ❌'
        }

        unstable {
            echo 'Pipeline is unstable! ⚠️'
        }
    }

    // Parameters for manual builds
    parameters {
        booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: 'Force deployment even if not on main/master branch'
        )
        choice(
            name: 'LOG_LEVEL',
            choices: ['INFO', 'DEBUG', 'ERROR'],
            description: 'Log level for the build'
        )
    }
}
