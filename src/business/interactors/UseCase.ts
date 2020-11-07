import { Observable, Observer, Subscription } from 'rxjs';
import { injectable } from 'inversify';

@injectable()
export abstract class UseCase<Params, T> {
    protected abstract buildUseCaseObservable(params: Params): Observable<T>;

    public execute(next?: (next: T) => void, error?: (error: Error) => void, complete?: () => void, params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(next, error, complete);
    }

    public executeForResult(next: (next: T) => void, params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(next, undefined);
    }

    public executeTolerantForResult(next: (next: T) => void, error: (error: Error) => void, params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(next, error, undefined);
    }

    public executeCompletable(complete: () => void, params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(undefined, undefined, complete);
    }

    public executeTolerantCompletable(complete: () => void, error: (error: Error) => void, params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(undefined, error, complete);
    }

    public justExecute(params?: Params): Subscription {
        return this.buildUseCaseObservable(params).subscribe(_ => {}, error => {}, () => {});
    }

    public asPromise(params?: Params): Promise<T> {
        return this.buildUseCaseObservable(params).toPromise();
    }
}