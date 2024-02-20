import { useNavigate } from 'react-router-dom';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized'
import { ErrorView } from './ErrorView'
import { ROOT_ROUTE } from '../../../constants/routes';

type RouteErrorHandlerProps = Readonly<{}>

export function RouteErrorHandler({ }: RouteErrorHandlerProps) {
    const navigate = useNavigate();

    return (
        <LocalizedStrict id='error-route' attrs={{ title: true, message: true, buttonLabel: true }} >
            <ErrorView
                title="Something went wrong"
                message="This page cannot be shown due to an unknown error"
                buttonLabel='Back to home'
                onClose={() => navigate(ROOT_ROUTE)}
            />
        </LocalizedStrict>
    )
}
