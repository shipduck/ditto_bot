pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm install
npm run build'''
      }
    }
    stage('Run') {
      steps {
        sh '''npm restart'''
      }
    }
  }
  environment {
    token = 'xoxb-2161018487-411742259925-MwR2rh04n84vTpRwx9HpqIrA'
  }
}
