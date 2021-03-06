import { IonItem, IonLabel } from '@ionic/react';
import { V1ReplicationController } from '@kubernetes/client-node';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { timeDifference } from '../../../../utils/helpers';

import ItemStatus from '../../misc/template/ItemStatus';

interface IReplicationControllerItemProps extends RouteComponentProps {
  item: V1ReplicationController;
  section: string;
  type: string;
}

const ReplicationControllerItem: React.FunctionComponent<IReplicationControllerItemProps> = ({
  item,
  section,
  type,
}: IReplicationControllerItemProps) => {
  const status = (): string => {
    if (item.spec === undefined || item.status === undefined || item.spec.replicas === 0) {
      return 'warning';
    }

    if (
      item.spec.replicas === item.status.replicas &&
      item.spec.replicas === item.status.readyReplicas &&
      item.spec.replicas === item.status.availableReplicas
    ) {
      return 'success';
    }

    if (
      item.status.readyReplicas === 0 ||
      item.status.availableReplicas === 0 ||
      item.status.readyReplicas === undefined ||
      item.status.availableReplicas === undefined
    ) {
      return 'danger';
    }

    return 'warning';
  };

  // - Desired: Number of desired pods.
  // - Current: Most recently oberved number of replicas.
  // - Ready: The number of ready replicas for this replication controller.
  // - Available: The number of available replicas (ready for at least minReadySeconds) for this replication controller.
  // - Age: The time when the deployment was created.
  return (
    <IonItem
      routerLink={`/resources/${section}/${type}/${item.metadata ? item.metadata.namespace : ''}/${
        item.metadata ? item.metadata.name : ''
      }`}
      routerDirection="forward"
    >
      <ItemStatus status={status()} />
      <IonLabel>
        <h2>{item.metadata ? item.metadata.name : ''}</h2>
        <p>
          Desired: {item.spec && item.spec.replicas ? item.spec.replicas : '0'}
          {item.status && item.status.replicas ? ` | Current: ${item.status.replicas}` : ' | Current: 0'}
          {item.status && item.status.readyReplicas ? ` | Ready: ${item.status.readyReplicas}` : ' | Ready: 0'}
          {item.status && item.status.availableReplicas
            ? ` | Available: ${item.status.availableReplicas}`
            : ' | Available: 0'}
          {item.metadata && item.metadata.creationTimestamp
            ? ` | Age: ${timeDifference(
                new Date().getTime(),
                new Date(item.metadata.creationTimestamp.toString()).getTime(),
              )}`
            : ''}
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default ReplicationControllerItem;
