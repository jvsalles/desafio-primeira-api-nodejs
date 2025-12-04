import { fastifySwagger } from '@fastify/swagger'
import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createCoursesRoute } from './src/routes/create-course.ts'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'

const server = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
         translateTime: 'HH:MM:ss Z',
         ignore: 'pid,hostname',
        },
      },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV !== 'development') {
  server.register(fastifySwagger, {
  openapi: {
   info: {
     title: 'Desafio Node.js',
     version: '1.0.0',
   }
},
transform: jsonSchemaTransform,
})

server.register(scalarAPIReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})
}

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(createCoursesRoute)
server.register(getCourseByIdRoute)
server.register(getCoursesRoute)

server.listen({ port: 3333 }).then(() => {
    console.log('Server running on http://localhost:3333')
})