export default class BuildEnvironment {
    public static readonly BUILD_RELEASE = "release";
    public static readonly BUILD_DEBUG = "debug";

    public static getBuildType(): string {
        return process.env.BUILD || this.BUILD_DEBUG;
    }
}