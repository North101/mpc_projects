import 'dotenv-flow/config'
import envVar from 'env-var'

export default {
  port: envVar.get('PORT').required().asPortNumber(),
  refreshProjects: {
    schedule: envVar.get('REFRESH_PROJECTS_SCHEDULE').asString(),
    immediatly: envVar.get('REFRESH_PROJECTS_IMMEDIATLY').default('false').asBool(),
    url: envVar.get('REFRESH_PROJECTS_URL').default('').asUrlString(),
    email: envVar.get('REFRESH_PROJECTS_EMAIL').default('').asEmailString(),
    password: envVar.get('REFRESH_PROJECTS_PASSWORD').default('').asString(),
  },
}
