import React from 'react'
import If from '../operador/If'

<If test={!props.hide}>
    <div className="form-group has-feedback">
        <input {...props.input} type={props.type} className='form-control' placeholder={props.placeholder} readOnly={props.readOnly} />
        <span className={`glyphicon glyphicon-${props.icon} form-control-feedback`} ></span>
    </div>
</If>