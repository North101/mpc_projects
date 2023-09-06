import 'dotenv-flow/config'
import envVar from 'env-var'

export default {
  port: envVar.get('PORT').required().asPortNumber(),
  refreshProjects: {
    schedule: envVar.get('REFRESH_PROJECTS_SCHEDULE').required().asString(),
    immediatly: envVar.get('REFRESH_PROJECTS_IMMEDIATLY').default('false').asBool(),
    url: envVar.get('REFRESH_PROJECTS_URL').required().asUrlString(),
    email: envVar.get('REFRESH_PROJECTS_EMAIL').required().asEmailString(),
    password: envVar.get('REFRESH_PROJECTS_PASSWORD').required().asString(),
  },
}
