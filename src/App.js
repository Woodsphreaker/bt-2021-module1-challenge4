import React, {useState, useEffect} from "react";
import {ScrollView, TextInput} from 'react-native'
import * as RepositoryService from './services/RepositoryService'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// import './config/ReactotronConfig'

export default function App() {

  const [repositories, setRepositories] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [techs, setTechs] = useState('')

  const getRepositories = async () => {
    try {
     const response = await RepositoryService.listRepositories()
     setRepositories(response)
    }
    catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRepositories()
  }, [])

  async function handleAddRepository() {
    
    const payload = {
      title,
      url,
      techs: techs.split(',')
    }
    try {
      const newRepository = await RepositoryService.createRepository(payload)
      setRepositories([...repositories, newRepository])
      const actions = [setTitle, setUrl]
      actions.forEach(action => action(''))
      setTechs([])
    }
    catch(error) {
      console.error(error)
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await RepositoryService.removeRepository(id)
      const filteredRepo = repositories.filter((repository) => repository.id !== id)
      setRepositories(filteredRepo)
    }
    catch(error) {
      console.error(error)
    }
  }

  async function handleLikeRepository(id) {
    try {
      await RepositoryService.likeRepository(id)
      const updatedRepositories = repositories.map((repository) => {
        if (repository.id === id) {
          return {
            ...repository,
            likes: repository.likes + 1
          }
        }
        return repository
      })

      setRepositories(updatedRepositories)

    }
    catch(error) {
      console.error(error)
    }
    // Implement "Like Repository" functionality
  }

  const renderTechs = (techs, repoID) => {
    return techs.map((tech) => (
      <Text key={`${repoID}-${tech}`} style={styles.tech}>
        {tech}
      </Text>
    ))
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

        <View style={styles.newTechContainer}>
          <Text style={styles.newTechContainerTitle}>
            Add New Repository
          </Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>Title</Text>
                <TextInput onChangeText={(text) => {setTitle(text)}} style={styles.formInput} value={title}/>
              </View>
              <View style={[styles.inputBlock, styles.spaceLeft]}>
                <Text style={styles.inputTitle}>Url</Text>
                <TextInput onChangeText={(text) => {setUrl(text)}} style={styles.formInput} value={url}/>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputTitle}>Techs</Text>
                <TextInput onChangeText={(text) => {setTechs(text)}} style={styles.formInput} value={techs}/>
              </View>
              <TouchableOpacity style={[styles.button, styles.spaceLeft]} onPress={handleAddRepository}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView>
        {
          repositories.map((repository) => (
            <View key={repository.id} style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {
                  renderTechs(repository.techs, repository.id)
                }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {`${repository.likes} curtidas`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          ))
        }
        </ScrollView>
        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 5,
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
    borderRadius: 5,
    textAlign: 'center',
  },

  newTechContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },

  newTechContainerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  form: {
    flexDirection: 'column',
  },

  inputBlock: {
    flex: 1
  },

  inputTitle: {
    marginLeft: 2,
    fontSize: 15
  },

  formInput: {
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },

  spaceLeft: {
    marginLeft: 10
  }

});
