import "reflect-metadata";

import Joi from "@hapi/joi";
import Router from "@koa/router";
import fs from "fs";
import Koa from "koa";
import { join } from "path";

// 方法装饰器 添加的元数据
interface MethodMetadata {
  method: MethodEnum;
  path: string;
}

// 支持的方法
const enum MethodEnum {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

// 使用 @hapi/joi 验证参数 分为 query 和 body 依赖 query 解析器和 body 解析器
const enum VerifyType {
  JoiQuery = "JoiVerifyQuery",
  JoiBody = "JoiVerifyBody",
}

interface VerifyMetadata {
  query: Joi.Schema | undefined;
  body: Joi.Schema | undefined;
}

// 从装饰器中收集的路由数据
interface RouterInfo {
  verify: VerifyMetadata;
  method: MethodEnum;
  path: string;
  methodName: string;
  controllerName: string;
  callObject: Function | object;
}

// 导出 json 时用到
interface RouterDetailedInfo {
  fullPath: string;
  routes: RouterInfo[];
}

// router 详尽信息
const routeFileTables: RouterDetailedInfo[] = [];

// 收集 router 信息
// 每次 import 一个文件, 然后
const routerTablesStack: RouterInfo[] = [];

// 处理 路由前缀
function margePrefix ( prefix: string, content: string ) {
  return prefix === "/" ? content : prefix + content;
}

// 校验参数
function JoiVerify<T> (
  ctx: Koa.Context,
  schema: Joi.Schema,
  value: T
): T | never {
  const result = schema.validate( value || {} );
  if ( result.error !== undefined ) {
    ctx.throw( 400, result.error.message );
  }
  return result.value;
}

// 装饰器 添加参数 schema
function JoiVerifyBase ( area: VerifyType, schema: Joi.Schema ): MethodDecorator {
  return function ( target, propertyKey, descriptor ) {
    if ( descriptor.value ) {
      Reflect.defineMetadata( area, schema, target, propertyKey );
    }
  };
}

// 装饰器 路由方法
function baseMethodFactory ( method: MethodEnum, path: string ): MethodDecorator {
  return function ( target, propertyKey, descriptor ) {
    if ( descriptor.value ) {
      Reflect.defineMetadata( propertyKey, { method, path }, target, "method" );
    }
  };
}

// 加载
async function load ( path: string ) {
  if ( (await fs.promises.stat( path )).isDirectory() ) {
    for ( const file of await fs.promises.readdir( path ) ) {
      const nextPath = join( path, file );
      if ( (await fs.promises.stat( nextPath )).isDirectory() ) {
        await load( nextPath );
        continue;
      }
      // TODO 判断规则加载 如只加载 .controller.ts 后缀的
      await import(nextPath);
      routeFileTables.push( {
        fullPath: nextPath,
        routes: [ ...routerTablesStack ],
      } );
      routerTablesStack.length = 0;
    }
  }
}

// 构建 koa-router
function toRouter ( rootPrefix: string ): Router {
  const rootRouter = new Router();
  for ( const fileTable of routeFileTables ) {
    for ( const route of fileTable.routes ) {
      const { methodName, method, verify, path, callObject } = route;
      rootRouter[ method ]( join( rootPrefix, path ), async ( ctx ) => {
        if ( verify.query ) {
          JoiVerify( ctx, verify.query, ctx.query );
        }
        if ( verify.body ) {
          // 需要 bodyParse 解析数据到 ctx.request.body
          JoiVerify( ctx, verify.body, (ctx.request as any).body );
        }
        return (callObject as any)[ methodName ]( ctx );
      } );
    }
  }
  return rootRouter;
}

function outputJSONFile ( filePath: string, rootPrefix: string ) {
  const list: any[] = [];
  for ( const fileTable of routeFileTables ) {
    for ( const route of fileTable.routes ) {
      const { methodName, method, path, controllerName } = route;
      list.push( {
        path: join( rootPrefix, path ),
        method: method,
        methodName: methodName,
        controllerName: controllerName,
        uri: fileTable.fullPath.replace( process.cwd(), "." ),
      } );
    }
  }
  const write = fs.createWriteStream( filePath );
  write.write( JSON.stringify( list, null, 2 ) );
  write.close();
}

export const Get = ( path: string ) => baseMethodFactory( MethodEnum.GET, path );
export const Post = ( path: string ) => baseMethodFactory( MethodEnum.POST, path );
export const Put = ( path: string ) => baseMethodFactory( MethodEnum.PUT, path );
export const Delete = ( path: string ) =>
  baseMethodFactory( MethodEnum.DELETE, path );
export const JoiVerifyQuery = ( schema: Joi.Schema ) =>
  JoiVerifyBase( VerifyType.JoiQuery, schema );
export const JoiVerifyBody = ( schema: Joi.Schema ) =>
  JoiVerifyBase( VerifyType.JoiBody, schema );

export function Controller ( prefix = "/" ): ClassDecorator {
  return function ( target ) {
    function mapMethodList ( isStatic: boolean ) {
      const callObject = isStatic ? target : target.prototype;
      const controllerName = isStatic
        ? callObject.name
        : callObject.constructor.name;
      const methodList = Reflect.getOwnMetadataKeys( callObject, "method" );
      for ( const methodName of methodList ) {
        const metadata = Reflect.getOwnMetadata(
          methodName,
          callObject,
          "method"
        ) as MethodMetadata;
        const QuerySchema = Reflect.getOwnMetadata(
          "JoiVerifyQuery",
          callObject,
          methodName
        );
        const BodySchema = Reflect.getOwnMetadata(
          "JoiVerifyBody",
          callObject,
          methodName
        );
        if ( metadata ) {
          routerTablesStack.push( {
            verify: {
              query: QuerySchema as Joi.Schema,
              body: BodySchema as Joi.Schema,
            },
            method: metadata.method,
            path: margePrefix( prefix, metadata.path ),
            methodName: methodName,
            controllerName: controllerName,
            callObject: callObject,
          } );
        }
      }
    }

    mapMethodList( false );
    mapMethodList( true );
  };
}

export async function loadController (
  path: string,
  options?: {
    output?: string,
    rootPrefix?: string,
  }
): Promise<Router> {
  const { output, rootPrefix = "" } = options || {};
  await load( path );
  const router = toRouter( rootPrefix );
  if ( output ) {
    outputJSONFile( output, rootPrefix );
  }
  routeFileTables.length = 0;
  routerTablesStack.length = 0;
  return router;
}
