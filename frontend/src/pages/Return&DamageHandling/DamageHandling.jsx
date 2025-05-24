import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DamageCards from '../../component/DamageHandling/DamageCards';

function DamageHandling() {

  const navigate = useNavigate();
  const location = useLocation();

  const isBaseRoute = location.pathname === "/returns";


  return (

    <div>

      {isBaseRoute && (

        <DamageCards />
      )}

      <main className='p-5'>
        <Outlet />
      </main>

    </div>

  );
}

export default DamageHandling;