import api from './api'

export const listRepositories = async () => {
  const response = await api.get('/repositories')
  const {data} = response
  return data
}

export const createRepository = async (payload) => {
  const {
    title,
    url,
    techs
  } = payload

  const response = await api.post('/repositories', {
    title,
    url,
    techs
  })

  const {data: newRepository} = response
  return newRepository
}

export const removeRepository = async (repositoryID) => {
  await api.delete(`repositories/${repositoryID}`)
  return 'ok'
}

export const likeRepository = async (repositoryID) => {
  await api.post(`repositories/${repositoryID}/like`)
  return 'ok'
}