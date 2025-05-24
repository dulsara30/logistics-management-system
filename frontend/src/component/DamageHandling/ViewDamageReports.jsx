import React from 'react';
import Items from '../../pages/Return&DamageHandling/items';

function ViewDamageReports() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">View Damage Reports</h1>
            <Items type="damage" />
        </div>
    );
}

export default ViewDamageReports;