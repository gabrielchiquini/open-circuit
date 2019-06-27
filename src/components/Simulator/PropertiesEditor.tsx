import React, {ChangeEvent, Component, FormEvent} from 'react';
import './PartSelector.scss';
import IPartProperties from './IPartProperties';
import {Modal} from 'react-bootstrap';

interface IPropsType {
  visible: boolean;
  fields: IPartProperties;
  editingHide: () => void;
  returnProperties: (property: IPartProperties) => void;
}

interface IStateType {
  fields: IPartProperties;
}

export default class PropertiesEditor extends Component<IPropsType, IStateType> {
  private formRef: React.RefObject<HTMLFormElement> = React.createRef();
  private inputFocus: HTMLInputElement;

  constructor(props: IPropsType) {
    super(props);
    this.state = {fields: {}};
  }

  componentWillReceiveProps(nextProps: IPropsType) {
    this.setState({fields: nextProps.fields});
  }

  componentDidUpdate() {
    if (this.inputFocus) {
      this.inputFocus.focus();
      this.inputFocus = null;
    }
  }

  render() {
    return (
      <Modal show={this.props.visible} onHide={this.props.editingHide} onEntered={this.opened}>
        <Modal.Header>
          <Modal.Title>Edit Properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitForm} ref={this.formRef}>
            {Object.keys(this.state.fields).map(name => {
              const property = this.state.fields[name];
              return (
                <div className="form-group" key={property.unit}>
                  <label>{property.label}</label>
                  <input
                    className="form-control"
                    type="number"
                    name={name}
                    defaultValue={property.value.toString()}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Required field</div>
                </div>
              );
            })}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={this.cancel} type="button">
            Close
          </button>
          <button className="btn btn-primary" type="submit" onClick={this.submitForm}>
            Save changes
          </button>
        </Modal.Footer>
      </Modal>
    );
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fields = this.state.fields;
    fields[e.target.name].value = parseFloat(e.target.value);
  };

  submitForm = (e: FormEvent) => {
    e.preventDefault();
    if (this.formRef.current.checkValidity()) {
      this.props.returnProperties(this.state.fields);
    }
  };

  cancel = () => {
    this.props.returnProperties(null);
  };
  private opened = () => {
    const input = Array.from(this.formRef.current.elements).find(el => el.tagName === 'INPUT') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };
}
