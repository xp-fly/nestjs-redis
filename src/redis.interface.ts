export interface RedisClientOptions {
    port: number; // 端口
    host: string; // 地址
    password: string; // 密码
    family?: number;
    db?: number;
}

export interface RedisModuleOptions extends RedisClientOptions {
    name?: string; // 连接名称 默认 default
}

export interface RedisModuleAsyncOption {
    useValue?: RedisModuleOptions[];
    useFactory?: (...args: any[]) => RedisModuleOptions[]; // 生成options的构造函数
    inject?: any[]; // 注入
}
