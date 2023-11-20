import 'dotenv-flow/config'
import envVar from 'env-var'

export default {
  port: envVar.get('PORT').required().asPortNumber(),
  refreshProjects: envVar.get('REFRESH_PROJECTS').default('true').asBool() ? {
    expression: envVar.get('REFRESH_PROJECTS_EXPRESSION').required().asString(),
    scheduled: envVar.get('REFRESH_PROJECTS_SCHEDULED').default('false').asBool(),
    immediatly: envVar.get('REFRESH_PROJECTS_IMMEDIATLY').default('false').asBool(),
    baseUrl: envVar.get('REFRESH_PROJECTS_BASE_URL').required().asUrlString(),
  } : null,
  mailer: envVar.get('MAILER').default('true').asBool() ? {
    baseUrl: envVar.get('MAILER_BASE_URL').required().asString(),
    host: envVar.get('MAILER_HOST').required().asString(),
    port: envVar.get('MAILER_PORT').required().asPortNumber(),
    user: envVar.get('MAILER_USER').required().asString(),
    pass: envVar.get('MAILER_PASS').required().asString(),
    from: envVar.get('MAILER_FROM').required().asEmailString(),
    to: envVar.get('MAILER_TO').required().asEmailString(),
  } : null,
}
