import { Observable, Observer } from 'rxjs';
import { injectable } from 'inversify';

@injectable()
export abstract class UseCase<Params, T> {
    protected abstract buildUseCaseObservable(params: Params): Observable<T>;

    public execute(next?: (next: T) => void, error?: (error: Error) => void, complete?: () => void, params?: Params): void {
        this.buildUseCaseObservable(params).subscribe(next, error, complete);
    }

    public asPromise(params: Params): Promise<T> {
        return this.buildUseCaseObservable(params).toPromise();
    }
}